import './ListeDossiers.scss';
import Dossier from './Dossier';
import {instanceFirestore} from '../firebase';
import { useEffect, useState } from 'react';

export default function ListeDossiers({utilisateur}) {
  let [dossiers, setDossiers] = useState([]);

  // On va chercher les données sur Firestore et raffraichir le composant.
  // 3 méthodes sont expliquées pour faire la même chose
  // Première méthode : en utilisant la syntaxe async/await 
  // (ce qui nous oblige d'écrire une fonction à l'intérieur de useEffect())
  useEffect(
    () => {
      // On crée une fonction asynchrone pour pouvoir utiliser la syntaxe await sur les requêtes asynchrones à Firestore
      async function chercherDossiers() {
        // Tableau qui va recevoir nos dossiers de Firestore
        const tabDossiers = [];
        // La requête à Firestore utilise 'await' pour retourner la réponse
        const reponse = await instanceFirestore.collection('utilisateurs').doc(utilisateur.uid).collection('dossiers').get();
        // On traverse la réponse ...
        reponse.forEach(
          // ... et pour chaque doc dans la réponse on ajoute un objet dans tabDossiers
          doc => tabDossiers.push({id: doc.id, ...doc.data()})
          // Remarquez que le 'id' ne fait pas partie des attributs de données des documents sur Firestore, et il faut l'extraire séparément avec la propriété 'id'. Remarquez aussi l'utilisation de l'opérateur de décomposition (spread operator (...))
        );
        // Une fois notre réponse traitée au complet et le tableau tabDossiers renpli avec tous les objets représentants les documents 'dossiers' trouvés, nous pouvons faire la mutation de l'état de la variable 'dossiers' (en utilisant le mutateur setDossiers) pour forcer un 'rerender' (réaffichage) du composant par React
        setDossiers(tabDossiers);
      }
      // Faut pas oublier d'appeler la fonction
      chercherDossiers();
    },[]
  );

  // Autre méthode (utilisant "then()" au lieu de "async/await")
  /*
  useEffect(
    () => {
      function chercherDossiers() {
        const tabDossiers = [];
        instanceFirestore.collection('utilisateurs').doc(utilisateur.uid).collection('dossiers').get().then(
          reponse => {
            reponse.forEach(doc => tabDossiers.push({id: doc.id, ...doc.data()}));
            setDossiers(tabDossiers);
          });
      }
      chercherDossiers();
    },[]
  );
  */
  
  // Autre méthode (utilisant "then()" encore une fois, mais cette fois-ci sans la fonction interne qui est superflue)
  /*
  useEffect(
    () => {
      const tabDossiers = [];
      instanceFirestore.collection('utilisateurs').doc(utilisateur.uid).collection('dossiers').get().then(
        reponse => {
          reponse.forEach(doc => tabDossiers.push({id: doc.id, ...doc.data()}));
          setDossiers(tabDossiers);
        });
    },[]
  );
  */

  
  return (
    <ul className="ListeDossiers">
      {
        dossiers.map( 
          dossier =>  <li key={dossier.id}><Dossier {...dossier} /></li>
        )
      }
    </ul>
  );
}