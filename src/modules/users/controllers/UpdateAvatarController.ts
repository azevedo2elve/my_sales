import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

export default class UpdateAvatarController {
  async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      userId: Number(request.user.id),
      avatarFilename: request.file?.filename as string,
    });

    return response.json(user);
  }
}
