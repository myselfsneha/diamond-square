const bcrypt = require("bcryptjs");
const db = require("../config/db");
const generateToken = require("../utils/generateToken");
const sendOTPEmail = require("../utils/sendOTPEmail");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      resident_type,
      flat_number,
      emergency_contact,
      occupation,
      date_of_birth,
      anniversary_date,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !resident_type ||
      !flat_number ||
      !date_of_birth
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    if (!["owner", "tenant"].includes(resident_type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Resident type must be Owner or Tenant.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();
    const normalizedFlat = flat_number.trim().toUpperCase();

    // Email or phone already exists?
    const { rows: existingUsers } = await db.query(
      `
      SELECT id
      FROM users
      WHERE LOWER(email) = LOWER($1)
         OR phone = $2
      `,
      [normalizedEmail, normalizedPhone]
    );

    if (existingUsers.length) {
      return res.status(400).json({
        success: false,
        message: "Resident already exists.",
      });
    }

    // Family member already registered?
    if (resident_type.toLowerCase() === "owner") {
      const { rows: familyMembers } = await db.query(
        `
        SELECT id
        FROM family_members
        WHERE LOWER(name)=LOWER($1)
          AND phone=$2
          AND user_id IN (
            SELECT id
            FROM users
            WHERE flat_number=$3
              AND resident_type='owner'
              AND approval_status='approved'
          )
        `,
        [name.trim(), normalizedPhone, normalizedFlat]
      );

      if (familyMembers.length) {
        const { rows: approvedUser } = await db.query(
          `
          SELECT *
          FROM users
          WHERE flat_number=$1
            AND resident_type='owner'
            AND approval_status='approved'
          LIMIT 1
          `,
          [normalizedFlat]
        );

        const user = approvedUser[0];

        const token = generateToken(user.id, user.role);

        return res.status(200).json({
          success: true,
          alreadyRegistered: true,
          message:
            "You are already registered as a family member. Please sign in.",
          token,
          user: {
            id: user.id,
            name: name.trim(),
            email: user.email,
            phone: normalizedPhone,
            role: user.role,
            resident_type: user.resident_type,
            flat_number: user.flat_number,
            approval_status: user.approval_status,
            profile_image: user.profile_image,
            emergency_contact: user.emergency_contact,
            occupation: user.occupation,
            date_of_birth: user.date_of_birth,
            anniversary_date: user.anniversary_date,
            is_active: user.is_active,
          },
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await db.query(
      `
      INSERT INTO users(
        name,
        email,
        phone,
        password,
        role,
        resident_type,
        flat_number,
        emergency_contact,
        occupation,
        date_of_birth,
        anniversary_date,
        approval_status,
        approval_otp,
        otp_expires_at,
        otp_verified,
        is_active
      )
      VALUES(
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
        'pending',
        NULL,
        NULL,
        FALSE,
        TRUE
      )
      RETURNING id
      `,
      [
        name.trim(),
        normalizedEmail,
        normalizedPhone,
        hashedPassword,
        "resident",
        resident_type.toLowerCase(),
        normalizedFlat,
        emergency_contact || null,
        occupation || null,
        date_of_birth,
        anniversary_date || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message:
        "Registration submitted successfully. Please wait for admin approval.",
      userId: rows[0].id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      resident_type,
      flat_number,
      emergency_contact,
      occupation,
      date_of_birth,
      anniversary_date,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !resident_type ||
      !flat_number ||
      !date_of_birth
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    if (!["owner", "tenant"].includes(resident_type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Resident type must be Owner or Tenant.",
      });
    }

    // Check whether this phone/email already belongs
    // to an approved member of the same flat.
    const { rows: existingUsers } = await db.query(
      `
      SELECT *
      FROM users
      WHERE LOWER(email)=LOWER($1)
         OR phone=$2
      `,
      [email.trim(), phone.trim()]
    );

    if (existingUsers.length) {
      return res.status(400).json({
        success: false,
        message: "Resident already exists.",
      });
    }

    // NEW: Check whether this flat already has an approved owner.
    const { rows: approvedOwners } = await db.query(
      `
      SELECT id
      FROM users
      WHERE flat_number=$1
        AND resident_type='owner'
        AND approval_status='approved'
      LIMIT 1
      `,
      [flat_number.trim().toUpperCase()]
    );

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await db.query(
      `
      INSERT INTO users(
        name,
        email,
        phone,
        password,
        role,
        resident_type,
        flat_number,
        emergency_contact,
        occupation,
        date_of_birth,
        anniversary_date,
        approval_status,
        approval_otp,
        otp_expires_at,
        otp_verified,
        is_active
      )
      VALUES(
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
        'pending',
        NULL,
        NULL,
        FALSE,
        TRUE
      )
      RETURNING id
      `,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        hashedPassword,
        "resident",
        resident_type.toLowerCase(),
        flat_number.trim().toUpperCase(),
        emergency_contact || null,
        occupation || null,
        date_of_birth,
        anniversary_date || null,
      ]
    );
        // If this is the first owner of the flat,
    // they become the primary account.
    if (
      resident_type.toLowerCase() === "owner" &&
      approvedOwners.length === 0
    ) {
      return res.status(201).json({
        success: true,
        message:
          "Registration submitted successfully. Please wait for admin approval.",
        userId: rows[0].id,
        isPrimaryOwner: true,
      });
    }

    // If another owner already exists,
    // this person will be linked after approval.
    if (
      resident_type.toLowerCase() === "owner" &&
      approvedOwners.length > 0
    ) {
      return res.status(201).json({
        success: true,
        message:
          "Registration submitted. If your details match an existing family member after admin approval, you'll automatically use the same household dashboard.",
        userId: rows[0].id,
        isPrimaryOwner: false,
      });
    }

    // Tenants always remain independent.
    return res.status(201).json({
      success: true,
      message:
        "Tenant registration submitted successfully. Please wait for admin approval.",
      userId: rows[0].id,
      isPrimaryOwner: false,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password are required.",
      });
    }

    const { rows } = await db.query(
      "SELECT * FROM users WHERE phone=$1",
      [phone.trim()]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    let user = rows[0];

    // If this owner belongs to an approved owner's family,
    // use the primary owner's account.
    if (user.resident_type === "owner") {
      const { rows: family } = await db.query(
        `
        SELECT u.*
        FROM family_members fm
        JOIN users u ON u.id = fm.user_id
        WHERE fm.phone = $1
          AND LOWER(fm.name) = LOWER($2)
          AND u.flat_number = $3
          AND u.approval_status = 'approved'
        LIMIT 1
        `,
        [
          user.phone,
          user.name,
          user.flat_number,
        ]
      );

      if (family.length) {
        user = family[0];
      }
    }

    if (user.approval_status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your account is awaiting admin approval.",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Your account has been temporarily suspended.",
      });
    }

    const matched = await bcrypt.compare(
      password,
      user.password
    );

    if (!matched) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone number or password.",
      });
    }

    const token = generateToken(user.id, user.role);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: rows[0].name, // Show the actual family member's name
        email: user.email,
        phone: rows[0].phone,
        role: user.role,
        resident_type: user.resident_type,
        flat_number: user.flat_number,
        approval_status: user.approval_status,
        profile_image: user.profile_image,
        emergency_contact: user.emergency_contact,
        occupation: user.occupation,
        date_of_birth: user.date_of_birth,
        anniversary_date: user.anniversary_date,
        is_active: user.is_active,
        canSwitchToAdmin: user.role === "admin",
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};