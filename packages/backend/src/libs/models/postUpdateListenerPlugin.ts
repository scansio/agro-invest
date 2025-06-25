/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from 'sequelize';
import ITimestamp, { GModel } from '../types/ITimestamp';

const postUpdateListenerPlugin = <T extends ITimestamp>(
  model: typeof GModel<T>,
  handler: (arg: GModel<T>) => any
): void => {
  // Attach a Sequelize hook to execute the handler after updating a record
  model.afterUpdate(async (instance: GModel<T>) => {
    await handler(instance);
  });

  // Attach a Sequelize hook to execute the handler after saving a record
  model.afterSave(async (instance: GModel<T>) => {
    await handler(instance);
  });

  // Attach a Sequelize hook to execute the handler after bulk updates
  model.afterBulkUpdate(async (options) => {
    //@ts-ignore
    if (options.attributes) {
      const updatedInstances = await model.findAll({ where: options.where });
      for (const instance of updatedInstances) {
        await handler(instance);
      }
    }
  });
};

export default postUpdateListenerPlugin;
