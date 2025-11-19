const { DataTypes } = require("sequelize");
const { sequelize } = require("../dataBase/dataBaseConnection.js");
const { image } = require("../utils/cloudinaryConfig.js");

const Users = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // ✅ تغيير من name إلى fullName
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "name", // ✅ يحافظ على اسم العمود في قاعدة البيانات
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "البريد الإلكتروني غير صحيح",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 100],
          msg: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: /^[0-9]{11}$/,
          msg: "رقم الهاتف يجب أن يكون 11 رقم",
        },
      },
    },

    imageUrl:{
      type:DataTypes.STRING,

    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_verified",
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
  },
  {
    tableName: "users",
    timestamps: true, // ✅ يفضل تفعيلها لتتبع createdAt و updatedAt
    // underscored: true, // ✅ يحول الأسماء إلى snake_case في قاعدة البيانات
  }
);

module.exports = Users;
