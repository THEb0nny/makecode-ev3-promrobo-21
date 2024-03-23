namespace motions {

    /**
     * Движение на расстояние в мм.
     * @param dist дистанция движения в мм, eg: 100
     * @param speed скорость движения, eg: 60
     * @param setBreak тип торможения, с удержанием позиции при истине, eg: true
     */
    //% blockId="DistMove"
    //% block="движение на расстояние $dist|на $speed|\\% и с жёстким тормозом $setBreak"
    //% inlineInputMode="inline"
    //% speed.shadow="motorSpeedPicker"
    //% setBreak.shadow="toggleOnOff"
    //% weight="3"
    //% group="Move"
    export function DistMove(dist: number, speed: number, setBreak: boolean = true) {
        if (dist == 0 || speed == 0) {
            CHASSIS_MOTORS.stop();
            return;
        }
        CHASSIS_MOTORS.setBrake(setBreak); // Удерживать при тормозе
        let mRotCalc = (dist / (Math.PI * WHEELS_D)) * 360; // Подсчёт по формуле
        CHASSIS_MOTORS.tank(speed, speed, mRotCalc, MoveUnit.Degrees); // Передаём команду моторам
    }

    // Вспомогательная функция для типа торможения движения на расстоние без торможения. Например, для съезда с линии, чтобы её не считал алгоритм движения по линии.
    export function RollingMoveOut(dist: number, speed: number) {
        if (dist == 0 || speed == 0) {
            CHASSIS_MOTORS.stop();
            return;
        }
        let lMotEncPrev = CHASSIS_L_MOTOR.angle(), rMotEncPrev = CHASSIS_R_MOTOR.angle(); // Значения с энкодеров моторов до запуска
        let calcMotRot = (dist / (Math.PI * WHEELS_D)) * 360; // Дистанция в мм, которую нужно пройти
        CHASSIS_MOTORS.steer(0, speed); // Команда вперёд

        let prevTime = 0; // Переменная предыдущего времения для цикла регулирования
        while (true) { // Пока моторы не достигнули градусов вращения
            let currTime = control.millis(); // Текущее время
            let dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            let lMotEnc = CHASSIS_L_MOTOR.angle(), rMotEnc = CHASSIS_R_MOTOR.angle(); // Значения с энкодеров моторы
            if (Math.abs(lMotEnc - lMotEncPrev) >= Math.abs(calcMotRot) || Math.abs(rMotEnc - rMotEncPrev) >= Math.abs(calcMotRot)) break;
            control.PauseUntilTime(currTime, 10); // Ожидание выполнения цикла
        }
        // Команды для остановки не нужно, в этом и смысл функции
    }
    
}