import { DataTypes, Model } from 'sequelize'
import { ITestimonial } from './ITestimonial'
import { CreateType } from '../../libs/types/ITimestamp'
import TimestampsPlugin from '../../libs/models/TimestampsPlugin'

class TestimonialModel extends Model<ITestimonial, CreateType<ITestimonial>> {}

TimestampsPlugin(
  { TestimonialModel },
  {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    personName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    occupationOrPosition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    personAvatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
)

export default TestimonialModel
