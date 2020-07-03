import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  slides = [
    {
      url: '../../assets/images/imagem1.jpg',
      text: 'Texto do primeiro slide'
    },
    {
      url: '../../assets/images/imagem2.jpg',
      text: 'Texto do segundo slide'
    },
    {
      url: '../../assets/images/imagem3.jpg',
      text: 'Texto do terceiro slide'
    }
  ]
}
