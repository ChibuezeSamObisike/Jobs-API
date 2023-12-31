const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;
  const job = await Job.findOne({ createdBy: userId, _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job found with Id: ${jobId}`);
  }
  res.json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (req, res) => {
  res.send("Delete Job");
};

const updateJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
    body: { position, company },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Company or position fields cannot be empty");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!job) {
    throw new NotFoundError(`No job found with Id: ${jobId}`);
  }

  res.send("Update Job");
};

module.exports = { getAllJobs, getJob, createJob, deleteJob, updateJob };
