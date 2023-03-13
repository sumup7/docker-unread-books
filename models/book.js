'use strict';
const {sequelize, DataTypes} = require('./sequelize-loader');

const Book = sequelize.define(
  'books',
  {
    bookId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    bookTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull:false
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull:false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    read: {
      type: DataTypes.BOOLEAN
    },
    photo: {
      type: DataTypes.STRING
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        fields: ['createdBy']
      }
    ]
  }
);

module.exports = Book;