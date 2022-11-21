import {replace} from 'lodash';
import numeral from 'numeral';

export function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function fShortenNumber(number) {
    return replace(numeral(number).format('0.00a'), '.00', '');
}