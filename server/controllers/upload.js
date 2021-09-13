const _ = require("lodash");
const formidable = require("formidable");
const sharp = require("sharp");
const express = require("express");
const path = require("path");
const fs = require("fs");
exports.uploadUserPic = async (req, res) => {
  const { filename } = req.file;
  console.log(req.file);
  await sharp(req.file.path)
    .resize(100, 100)
    .png({ quality: 80 })
    .toFile(path.resolve(req.file.destination + "/resized/", filename));
  fs.unlinkSync(req.file.path);
  res.json({
    success: 1,
    profile_url: `static/images/resized/${req.file.filename}`,
  });
};
exports.uploadPostPic = async (req, res) => {
  const { filename } = req.file;
  console.log(req.file);
  await sharp(req.file.path)
    .resize(300, 300)
    .png({ quality: 100 })
    .toFile(path.resolve(req.file.destination + "/resized/", filename));
  fs.unlinkSync(req.file.path);
  res.json({
    success: 1,
    image_url: `static/postimages/resized/${req.file.filename}`,
  });
};
