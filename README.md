<h1>Project opstarten</h1>

<p>Hieronder willen we beschrijven hoe je ons project kan opstarten op uw eigen device. In ons geval ga ik het project opstarten op een windows computer. Ik zal in stappen uitleggen hoe je alles moet toepassen.</p>
<h2>BELANGRIJK!</h2>
<p>Wij gebruiken <a href="https://nodejs.org/en">Node.js</a> voor het opstarten van het project. Download de latest version, tijdens het installeren hoef je nergens op te drukken behalve "Next".</p>
<p>Ook belangrijk dit is een test account dus Two Factor Authenticate gaat niet werken of andere functies waarbij de email verstuurd word.</p>

<h2>Inlog gegevens</h2>
<p>Email: test@test.nl<br>
  Wachtwoord: test123</p>

<p>We gaan het project opstarten in de terminal.</p><br>

<ol>
  <li>
    <p><b>Map aanmaken</b><br>
    Ga naar je <b>bureaublad</b>. Maak een nieuwe map aan op desktop genaamd "ProjectC".</p>
  </li>
  <li>
    <p><b>Github clonen</b><br>
    Ga naar de <a href="https://github.com/Voxxai/ProjectC">Github</a> van onze Projectgroep. Druk op "< > Code" en kopieer de Github url (https://github.com/Voxxai/ProjectC.git).<br><br>
    Haal de ProjectC map erbij en open deze lege folder. Klik rechter muisknop en kies voor "Openen in Terminal". In de Terminal type "git clone https://github.com/Voxxai/ProjectC.git" en druk enter. Wacht totdat het klaar is met clonen.</p> 
  </li>
  <li>
    <p><b>Project opbouwen</b><br>
    Als je kijkt in je map zie je dat er nieuwe mappen zijn toegevoegd. Ga naar de map /ProjectC-Client en open deze. Druk nogmaals rechter muisknop en kies voor "Openen in Terminal".<br><br>
    Type in the Terminal <b>"npm i"</b> en laat het alle packages downloaden.<br><br>
    Als dit klaar is ga dan naar de map ProjectC-Server en doe dit nogmaals. (Recht muisknop in de map en kies voor "Openen in Terminal" en type "npm i")</p>
  </li>
  <li>
      <p><b>Project starten</b><br>
      Nu gaan we het project starten. Ga naar de map /ProjectC-Server, druk rechter muisknop en kies voor "Openen in Terminal". Type in de Terminal "node server.js" en wacht totdat er staat "Server listening".<br><br>
      Open nu de map /ProjectC-Client, druk rechter muisknop en kies voor "Openen in Terminal". Type in de Terminal "npm start" en wacht totdat er een webbrowser of tab wordt ingeladen.</p>
    </li>
</ol>

<p>Bedankt voor het lezen</p>
