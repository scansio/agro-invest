/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from 'sequelize';
import ITimestamp, { GModel } from '../types/ITimestamp';

const postCreateListenerPlugin = <T extends ITimestamp>(
  model: typeof GModel<T>,
  handler: (arg: GModel<T>) => Promise<any> | void
): void => {
  // Attach a Sequelize hook to execute the handler after creating a record
  model.afterCreate(async (instance) => {
    await handler(instance);
  });
};

export default postCreateListenerPlugin;
