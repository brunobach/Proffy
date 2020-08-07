"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertHourToMinutes(time) {
    // divide uma string de hora (8:00) onde tem os dois pontos e retorna um array
    // faço uma desestruturação, na primeira poisção retorna a hora, e na segunda, retorna os minutos
    const [hour, minutes] = time.split(':').map(Number);
    // faço a conversão de  hora em minutos
    const timeInMinutes = (hour * 60) + minutes;
    // retorno
    return timeInMinutes;
}
exports.default = convertHourToMinutes;
