import  { ActivationStatus } from '../enums/activation-status.ts';

export const activationStatusRecord:Record<ActivationStatus,string>={
    [ActivationStatus.ACTIVE]:'Active',
    [ActivationStatus.INACTIVE]:'Inactive'
}