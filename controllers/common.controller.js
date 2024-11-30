import httpStatus from "http-status";
import { errorResponse, successResponse } from "../helpers";
import { commonService } from "../services";

export const uploadS3 = async (req, res) => {
    try {
      let data = await commonService.uploadS3(req.file, req.body.folderName);
      return successResponse(req, res, data);
    } catch (error) {
      console.log("err", error);
      return errorResponse(
        req,
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  };
export const uploadCloudinary = async (req, res) => {
    try {
      let data = await commonService.uploadCloudinary(req.file,req.body.folderName);
      return successResponse(req, res, data);
    } catch (error) {
      console.log("err", error);
      return errorResponse(
        req,
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  };
  
  export const revokeAccessToken = async (req, res) => {
    try {
      let data = await commonService.revokeAccessToken(req.body.refreshToken);
      return successResponse(req, res, data);
    } catch (error) {
      console.log("err", error);
      return errorResponse(
        req,
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  };
  
  