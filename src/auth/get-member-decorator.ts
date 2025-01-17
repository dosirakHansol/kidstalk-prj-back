import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Member } from "./member.entity";

export const GetMember = createParamDecorator((data, ctx: ExecutionContext): Member => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
}) as any

