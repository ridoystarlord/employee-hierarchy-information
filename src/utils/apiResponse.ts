import { Response } from 'express';

type IApiReponse<T> = {
  success: boolean;
  message?: string | null;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: T | null;
};

const APIResponse = <T>(res: Response, data: IApiReponse<T>): void => {
  const responseData: IApiReponse<T> = {
    success: data.success,
    message: data.message || null,
    pagination: data.pagination || null || undefined,
    data: data.data || null || undefined,
  };

  res.json(responseData);
};

export default APIResponse;
