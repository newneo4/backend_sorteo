import * as awardsModel from '../models/awardsModel.js'

export const create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ msg: 'Falta nombre del award' });

    const award = await awardsModel.createAward({ name });
    res.status(201).json(award);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

export const assign = async (req, res) => {
  try {
    const { awardId, ticketNumber } = req.body;
    if (!awardId || !ticketNumber) return res.status(400).json({ msg: 'Faltan datos' });

    const result = await awardsModel.assignAwardToCode({ awardId, ticketNumber });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message || 'Error del servidor' });
  }
};

export const list = async (req, res) => {
  try {
    const rows = await awardsModel.listAwards();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

