import bcrypt from "bcrypt";

const saltRounds = 10; // Es buena práctica llamarlo saltRounds

// 1. Le cambiamos el nombre a la función
export async function hashPassword(pass: string) {
  // 2. Usamos el método asíncrono 'hash' con 'await'
  return await bcrypt.hash(pass, saltRounds);
}

export async function comparePass(pass: string, userPass:string){
  return await  bcrypt.compare(pass, userPass);
}