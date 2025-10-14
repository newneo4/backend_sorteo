import * as codesModel from '../models/codesModel.js';

export const create = async (req, res) => {
  try {
    const { ticket_number, code } = req.body;
    if (!ticket_number || !code) return res.status(400).json({ msg: 'Faltan datos' });

    const existing = await codesModel.getCodeByCodeOrTicket({ code, ticket_number });
    if (existing) return res.status(409).json({ msg: 'Código o ticket ya registrado' });

    const newCode = await codesModel.createCode({ ticket_number, code });
    res.status(201).json(newCode);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

export const redeem = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ msg: 'Se requiere code' });

    const found = await codesModel.getCodeByCodeOrTicket({ code, ticket_number: null });
    if (!found) return res.status(404).json({ msg: 'Código no encontrado' });
    if (found.used) return res.status(400).json({ msg: 'Código ya usado' });

    const used = await codesModel.markUsed(found.id);

    res.json({ used, winner: used.winner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

export const listWinners = async (req, res) => {
  try {
    const winners = await codesModel.listWinners();
    res.json(winners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

