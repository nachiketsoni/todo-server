import { formatPagination,formatPaginationResponse } from "../config/pagination";
import { formatFilter } from "../config/filter";
import { GenerateAccessToken, GenerateRefreshToken } from "../config/authentication";
import { User } from "../models";
import ApiError from "../helpers/error/ApiError";
import mongoose ,{ Types } from "mongoose";
import httpStatus from "http-status";


export const create = async (body) => {
  try {

    const data = await User(body);
    const user = await data.save();

    const accessToken = GenerateAccessToken({email: user.email, _id: user._id});
    const refreshToken = GenerateRefreshToken({_id: user._id});

    return {user , accessToken, refreshToken};
  } catch (error) {
    throw error;
  }
};

export const login = async (body) => {
  try {
    const { email, password } = body;
    const user = await User.findOneWithPWD({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordMatch = await user.comparePassword(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }
    const accessToken = GenerateAccessToken({email: user.email, _id: user._id});
    const refreshToken = GenerateRefreshToken({_id: user._id});
    return {user , accessToken, refreshToken};
  } catch (error) {
    throw error;
  }
}

export const getWithPagination = async (
  query,
  pagination,
  sort = { _id: -1 },
) => {
  try {
    let filters = [],
      newFilter = [],
      filter = {},
      _query = [],
      result;

    
    if (filters.length > 0) {
      newFilter = await formatFilter(filters);
      filter = { ...filter, $and: newFilter };
    }
    let paginationData = await formatPagination(
      pagination.limit,
      pagination.page
    );
    _query = [
      { $match: { ...filter } },
      { $sort: sort },
      { $skip: paginationData.skip },
      { $limit: paginationData.limit },
      { $unset: "password" }
    ];
    result = await User.aggregate(_query);
    let totalCount = await User.countDocuments(filter);
    result = await formatPaginationResponse(
      pagination.limit,
      totalCount,
      result,
      pagination.page
    );
    return result;
  } catch (e) {
    throw e;
  }
};

export const deleteByIds = async (ids) => {
    try {
    let result = await User.deleteMany({
      _id: { $in: ids.map((item) => mongoose.Types.ObjectId(item)) },
    });
    return result;
  } catch (e) {
    throw e;
  }
};

export const getById = async (...args) => {
  try {
    let [id] = args;
    id = id ?Types.ObjectId(id) : "";
    let result = await User.aggregate([{ $match: { _id: id } }, { $unset: "password" }]);
    let data = {};
    data = result.length > 0 ? result[0] : {};
    if (!data || Object.keys(data).length < 1)
      throw new ApiError(httpStatus.NOT_FOUND, ERROR.NOT_FOUND);
    return data;
  } catch (err) {
    throw err;
  }
};

export const update = async (id, updateBody = {}) => {
  try {
    let data = await User.findOne({ _id: new Types.ObjectId(id) });
    if (!data || data == null)
      throw new ApiError(httpStatus.BAD_REQUEST, ERROR.NOT_FOUND);
    await User.updateOne({ _id: new Types.ObjectId(id) }, { $set: updateBody });
    const updatedData = await getById(new Types.ObjectId(id));
    return updatedData;
  } catch (error) {
    throw error;
  }
};
export const upload = async (file) => {
  try {
    let result = file;
    return result;
  } catch (error) {
    throw error;
  }
};
