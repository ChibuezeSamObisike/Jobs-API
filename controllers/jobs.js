const getAllJobs = async (req, res) => {
  res.json(req.user);
};

const getJob = async (req, res) => {
  res.json(req.user);
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  res.json(req.user);
};

const deleteJob = async (req, res) => {
  res.send("Delete Job");
};

const updateJob = async (req, res) => {
  res.send("Update Job");
};

module.exports = { getAllJobs, getJob, createJob, deleteJob, updateJob };
