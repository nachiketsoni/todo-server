import httpStatus from "http-status";
import { successResponse, errorResponse } from "../helpers";
import { userService } from "../services";


export const getWithPagination = async (req, res) => {
  try {
    const { limit, currentPage, sort, } = req.query;
    
    const sortParams = sort ? sort : { _id: -1 };

    const data = await userService.getWithPagination(
      req.query,
      { limit: parseInt(limit?? Number.MAX_SAFE_INTEGER), page: parseInt(currentPage ?? 1) },
      sortParams, 
    );

    return successResponse(req, res, data);
  } catch (error) {
    return errorResponse(
      req,
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};



export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await userService.getById(id);
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

export const create = async (req, res) => {
  try {
    const data = await userService.create(req.body);
    return successResponse(req, res, data);
  } catch (error) {
    console.log(error);
    return errorResponse(
      req,
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      error
    );
  }
};

export const login = async (req, res) => {
  try {
    const data = await userService.login(req.body);
    return successResponse(req, res, data);
  } catch (error) {
    console.log(error);
    return errorResponse(
      req,
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      error
    );
  }
};




export const update = async (req, res) => {
  try {
    let { id } = req?.params;
    const updatedData = await userService.update(id, req.body);
    return successResponse(req, res, updatedData);
  } catch (error) {
    return errorResponse(
      req,
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};


export const deleteByIds = async (req, res) => {
  try {
    let data = await userService.deleteByIds(req.body.ids);
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


