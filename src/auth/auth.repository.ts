import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }
    
    async createUser(authCredentialDto: AuthCredentialDto): Promise<void> {
        const { username, password } = authCredentialDto;

        //비밀번호 암호화
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.create({ 
            username, 
            password: hashedPassword
        });

        try {
            await this.save(user);
        } catch (error) {
            if(error.code === '23505'){
                throw new ConflictException('Existing username');
            } else{
                throw new InternalServerErrorException();
            }
        }
    }
}