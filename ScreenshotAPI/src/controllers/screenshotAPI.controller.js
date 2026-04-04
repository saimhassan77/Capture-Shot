import puppeteer from "puppeteer";
import asyncHandler from "../utils/asyncHandler.js"
import apiResponse from "../utils/apiResponse.js"
import apiError from "../utils/apiError.js"
import { uploadCloudinary, deleteCloudinary } from "../utils/cloudinary.js"

const takeScreenshot = asyncHandler(async (req, res) => {

  const { url, Width, Height, pageSize } = req.body;

  if (!(url && Width && Height && pageSize)) {
    throw new apiError(400, "All field are required")
  }


  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Locate a website and open
  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  // set a width and height
  await page.setViewport({ width: Width, height: Height });
  //width: 412, height: 892 Mobile Size
  //width: 1280, height: 800 Dasktop Size

  let toggle = false;
  if (pageSize === "full") {
    toggle = true;
  } else {
    toggle = false;
  }

  // Capture a screenshot
  const filePath = `./public/temp/temp.png`;
  await page.screenshot({
    fullPage: toggle,
    path: filePath
  });

  await browser.close();

  const screenshot = await uploadCloudinary(filePath)

  setTimeout(async () => {
    await deleteCloudinary(screenshot.public_id)
  }, 60000)


  res.status(200).json(new apiResponse(200, screenshot.url, "Screenshot is Successfull"))
})

export {
  takeScreenshot,
}