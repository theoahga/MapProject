/**
 * ATTENTION!!
 * Classe imcomplete (variable concernant la station à implémenter )
 */
import {toHoursAndMinutes} from "./RoutingInfosUtils.js";

export async function chargeTime(Cap,chargePourcent, stationPower, nom){
    // Capacité de la voiture en KWh
    let CapBat = Cap;
    // Pourcentage de charge initial de la voiture 
    let SOCinitial = chargePourcent;
    // Pourcent SOCpalier de la Station (en fonction de sa puissance)
    let SOCpalier = getSOCpalier(stationPower);
    // Puissance max de la Station 
    let Pmax = stationPower;

    let tempsTotal = pmax100(CapBat,SOCpalier,SOCinitial,Pmax) +pmax75(CapBat,SOCpalier,SOCinitial,Pmax) +pmax50(CapBat,SOCpalier,SOCinitial,Pmax) +pmax25(CapBat,SOCpalier,SOCinitial,Pmax);


    return tempsTotal;
}

function pmax100(CapBat, SOCpalier, SOCinitial,Pmax){
    let mins = 0;
    if(SOCinitial < SOCpalier){
        mins = 60 * ((SOCpalier - SOCinitial)/100) * CapBat/Pmax;
    }
    return mins;
}

function pmax75(CapBat, SOCpalier, SOCinitial,Pmax){
    let mins = 0;
    if(SOCinitial < SOCpalier || SOCinitial < (SOCpalier+100)/2){
        mins = 60 * (((SOCpalier + 100)/2)- SOCpalier)/100 * CapBat/(0, 75 * Pmax);
    }
    return mins;
}

function pmax50(CapBat, SOCpalier, SOCinitial, Pmax){
    let mins = 0;
    if(SOCinitial < (SOCpalier+100)/2){
        mins = 60 * (((SOCpalier + 500)/6)-((SOCpalier + 100)/2))/100 * CapBat/(0, 5 * Pmax);
    }else if(SOCinitial < (SOCpalier+500)/6){
        mins = 60 * (((SOCpalier + 500)/6)-SOCinitial)/100 * CapBat/(0, 5 * Pmax);
    }
    return mins;
}

function pmax25(CapBat, SOCpalier, SOCinitial,Pmax){
    let mins = 0;
    if(SOCinitial< (SOCpalier+500)/6){
        mins = 60 * (100 - ((SOCpalier + 500)/6))/100 * CapBat/(0, 25 * Pmax);
    }else if(SOCinitial<100){
        mins = 60 * (100 - SOCpalier)/100 * CapBat/(0, 25 * Pmax);
    }
    return mins;
}

function getSOCpalier(power){
    let ret;

    if(power>=40){
        ret = 75;
    }else if (power<40 && power>=35){
        ret = 81;
    }else if (power<35 && power>=30){
        ret = 83;
    }else if (power<30 && power>=25){
        ret = 85;
    }else if (power<25 && power>=20){
        ret = 88;
    }else if (power<20 && power>=15){
        ret = 92;
    }else if (power<15 && power>=10){
        ret = 95;
    }else if (power<10 && power>=5){
        ret = 98;
    }else if (power<5 && power>=0){
        ret = 98;
    }
    return ret;
}