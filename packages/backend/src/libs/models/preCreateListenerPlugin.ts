/* eslint-disable @typescript-eslint/no-explicit-any */
import ITimestamp, { GModel } from '../types/ITimestamp';

const preCreateListenerPlugin = <T extends ITimestamp>(
  model: typeof GModel<T>,
  handler: (arg: GModel<T>) => Promise<any>
): void => {
  // Attach a Sequelize hook to execute the handler before creating a record
  model.beforeCreate(async (instance: GModel<T>) => {
    await handler(instance);
  });
};

export default preCreateListenerPlugin;
