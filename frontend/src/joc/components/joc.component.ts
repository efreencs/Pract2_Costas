import { Component, OnInit } from '@angular/core';
import { PuntuacioService } from '../../services/PuntuacioService';

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

export class JocComponent implements OnInit {
nomUsuari = '';
nivell = 5;
tempsRestant = 5;
jocActiu = false;
intervalId: any;

dataInici!: Date;

caselles: Casella[] = [];
top5: any[] = [];
ultimaPuntuacio: any = null;
millorPuntuacioPersonal: any = null;
puntuacioGuardada: any = null;


constructor(private puntuacioService: PuntuacioService) {}

ngOnInit() {
this.carregarMillorPuntuacioPersonal();
}

iniciarJoc() {
if (!this.nomUsuari || this.nivell < 0) return;

this.jocActiu = true;
this.tempsRestant = 5;
this.dataInici = new Date();
this.ultimaPuntuacio = null;
this.puntuacioGuardada = null;

this.crearCaselles();
this.carregarTop5();

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

obrirCasella(index: number) {
if (!this.jocActiu || this.caselles[index].oberta) return;

const casella = this.caselles[index];
casella.oberta = true;

if (casella.tipus === 'premi') {
this.tempsRestant += casella.valor;
casella.text = `+${casella.valor}s`;
} else if (casella.tipus === 'castig') {
this.tempsRestant -= 1;
casella.text = '-1s';
} else {
casella.text = 'X';
}
}

carregarTop5() {
this.puntuacioService.top5(this.nivell)
.subscribe((res: any) => {
this.top5 = res;
});
}

acabarJoc() {
if (!this.jocActiu) return;

this.jocActiu = false;
clearInterval(this.intervalId);

const dataFinal = new Date();

const puntuacio = {
nom: this.nomUsuari,
nivell: this.nivell,
dataInici: this.dataInici,
dataFinal: dataFinal
};

this.puntuacioService.registrar(puntuacio)
.subscribe((res: any) => {
this.ultimaPuntuacio = res;
this.puntuacioGuardada = res;
this.verificarMillorPuntuacio(res);
this.carregarTop5();
});
}

verificarMillorPuntuacio(novaPuntuacio: any) {
const clau = `millorPuntuacio_nivell_${this.nivell}`;
const millorActual = this.millorPuntuacioPersonal;

if (!millorActual || novaPuntuacio.temps > millorActual.temps) {
this.millorPuntuacioPersonal = novaPuntuacio;
localStorage.setItem(clau, JSON.stringify(novaPuntuacio));
}
}

carregarMillorPuntuacioPersonal() {
if (this.nivell) {
const clau = `millorPuntuacio_nivell_${this.nivell}`;
const guardat = localStorage.getItem(clau);
if (guardat) {
this.millorPuntuacioPersonal = JSON.parse(guardat);
} else {
this.millorPuntuacioPersonal = null;
}
}
}

canviNivell() {
this.carregarMillorPuntuacioPersonal();
if (!this.jocActiu) {
this.carregarTop5();
}
}

actualitzarPuntuacio() {
if (!this.puntuacioGuardada || !this.ultimaPuntuacio) return;

this.puntuacioService.actualitzar(this.puntuacioGuardada._id, {
nom: this.nomUsuari,
nivell: this.nivell,
dataInici: this.ultimaPuntuacio.dataInici,
dataFinal: this.ultimaPuntuacio.dataFinal
}).subscribe({
next: (res: any) => {
this.puntuacioGuardada = res;
this.verificarMillorPuntuacio(res);
this.carregarTop5();
alert('Puntuació actualitzada!');
},
error: (err) => {
console.error('Error actualitzant:', err);
}
});
}

potsActualitzar(): boolean {
return !!(
this.puntuacioGuardada &&
this.ultimaPuntuacio &&
this.millorPuntuacioPersonal &&
this.ultimaPuntuacio.temps > this.millorPuntuacioPersonal.temps
);
}
}