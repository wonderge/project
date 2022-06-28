import type { NextApiRequest, NextApiResponse } from 'next'
import withCheck from '../../middlewares/withCheck'
import ResModel from '../../models/ResModel'
import { SashModel } from './../../models/SashModel';
import { EndType } from './../../models/SideType';
import { isNum, isEnum } from './../../helpers/check';

const checkInputs = (req: NextApiRequest): boolean => {
  const { amount, length, width, fabricWidth, type } = req.body
  const numCheck = isNum(amount) && isNum(length) && isNum(width) && isNum(fabricWidth)
  const typeCheck = isEnum(type, EndType)
  return numCheck && typeCheck
}

const handler = (req: NextApiRequest, res: NextApiResponse<ResModel>) => {
  const { amount, width, fabricWidth, type }: SashModel = req.body
  let { length }: SashModel = req.body

  if (type === EndType.Slant) {
    length += width
  }

  const ratio = Math.floor(fabricWidth / width)
  const yards = (Math.ceil(amount / ratio) * length / 36) * 1.03 + 0.1
  const meters = (Math.ceil(amount / ratio) * length / 39) * 1.03 + 0.1

  return res.json({ yards: yards.toFixed(1), meters: meters.toFixed(1) })
}

export default withCheck(handler, checkInputs)