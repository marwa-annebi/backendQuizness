const expressAsyncHandler = require("express-async-handler");
const Proposition = require("../../models/propositionModel");

const createProposition =async  function (proposition,_id,id) {
const i="."+(await Proposition.count({question:_id})+1)
  return Proposition.create({...proposition,question:_id,_id_proposition:id+i}).then((docProposition) => {
  return docProposition;

  });
};

// delete proposition

const deleteProposition = expressAsyncHandler(async (req, res) => {
  // const id = req.params.id;
  await Proposition.deleteOne({ _id})
    .then(res.send({ message: "Proposition was deleted successfully!" }))
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Proposition ",
      });
    });
});

// update proposition

const updateProposition = expressAsyncHandler(async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;
  Proposition.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Proposition. Maybe Proposition was not found!`,
        });
      } else res.send({ message: "Proposition was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Proposition with ",
      });
    }
    );
});

//get Proposition by id

const getPropositionById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  Proposition.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Proposition with " });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Proposition" });
    });
});

//find all

const findAllProposition = expressAsyncHandler(async(req,res)=>{
  Proposition.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving propositions."
      });
    });
})

module.exports = {
  createProposition,
  deleteProposition,
  updateProposition,
  getPropositionById,
  findAllProposition
};
