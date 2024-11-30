import { formatPagination,formatPaginationResponse } from "../config/pagination";
import { formatFilter } from "../config/filter";

import { Task } from "../models";
import ApiError from "../helpers/error/ApiError";
import mongoose ,{ Types } from "mongoose";
import httpStatus from "http-status";


export const create = async (body,authInfo) => {
  try {
    body.created_by = authInfo._id
    const data = await Task(body);
    const result = await data.save();

    return result;
  } catch (error) {
    throw error;
  }
};

export const getWithPagination = async (
  query,
  pagination,
  sort = { _id: -1 },
  authInfo
) => {
  try {
    let {  status, priority, title,description, due_date } = query;
    let filters = [],
      newFilter = [],
      filter = {},
      _query = [],
      result;
      if (authInfo?._id) {
        filters.push({
          column_id: "created_by",
          value: authInfo?._id,
          type: "OBJECTID",
        });
      }
      if (status) {
        filters.push({
          column_id: "status",
          value: status,
          type: "TEXT",
        });
      }
      if (priority) {
        filters.push({
          column_id: "priority",
          value: priority,
          type: "TEXT",
        });
      }
      if (title) {
        filters.push({
          column_id: "title",
          value: title,
          type: "TEXT",
        });
      }
      if (description) {
        filters.push({
          column_id: "description",
          value: description,
          type: "TEXT",
        }); 
      }
      if (due_date) {
        filters.push({
          column_id: "due_date",
          value: due_date,
          type: "DATE",
        });
      }
    
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
    ];
    result = await Task
    .aggregate(_query);
    let totalCount = await Task
    .countDocuments(filter);
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
    let result = await Task
    .deleteMany({
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
    let result = await Task.aggregate([{ $match: { _id: id } }]);
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
    let data = await Task
    .findOne({ _id: new Types.ObjectId(id) });
    if (!data || data == null)
      throw new ApiError(httpStatus.BAD_REQUEST, ERROR.NOT_FOUND);
    await Task
    .updateOne({ _id: new Types.ObjectId(id) }, { $set: updateBody });
    const updatedData = await getById(new Types.ObjectId(id));
    return updatedData;
  } catch (error) {
    throw error;
  }
};

