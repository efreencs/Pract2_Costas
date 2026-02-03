import { Component } from '@angular/core';
import { PuntuacioService } from '../../services/puntuacio.service';

interface Casella {
tipus: 'premi' | 'castig' | 'res';
valor: number;
oberta: boolean;
text: string;
}

@Component({
selector: 'app-joc',
templateUrl: './joc.component.html'
})

export class JocComponent {
nomUsuari = '';
nivell = 5;
tempsRestant = 5;
jocActiu = false;
intervalId: any;

dataInici!: Date;
ultimaPuntuacio: any;


constructor(private puntuacioService: PuntuacioService) {}
iniciarJoc() {
if (!this.nomUsuari || this.nivell < 2) return;

this.jocActiu = true;
this.tempsRestant = 5;
this.dataInici = new Date();

this.crearCaselles();

this.intervalId = setInterval(() => {
this.tempsRestant--;

if (this.tempsRestant <= 0) {
this.acabarJoc();
}
}, 1000);
}

crearCaselles() {
const total = this.nivell * this.nivell;
this.caselles = [];

const premis = Math.floor(total * 0.3);
const castigs = Math.floor(total * 0.2);

let tipusArray: ('premi' | 'castig' | 'res')[] = [];

tipusArray.push(...Array(premis).fill('premi'));
tipusArray.push(...Array(castigs).fill('castig'));
tipusArray.push(...Array(total - premis - castigs).fill('res'));

// Barrejar
tipusArray = tipusArray.sort(() => Math.random() - 0.5);

this.caselles = tipusArray.map(tipus => ({
tipus,
valor: tipus === 'premi'
? Math.floor(Math.random() * 5) + 1
: 0,
oberta: false,
text: ''
}));
}

carregarTop5() {
this.puntuacioService.top5(this.nivell)
.subscribe((res: any) => {
this.top5 = res;
});
}
}