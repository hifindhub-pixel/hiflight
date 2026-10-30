// Resolve existing HiFlight destination links without guessing between homonyms.
export async function resolveAgodaDestination(destination:string,signal?:AbortSignal):Promise<number>{
 const response=await fetch(`/api/agoda-destinations/?q=${encodeURIComponent(destination)}`,{signal});
 if(!response.ok)throw new Error('La recherche de destinations est indisponible. Réessayez.');
 const data=await response.json() as {results:{id:number;name:string;country:string;label:string}[]};
 const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const key=normalize(destination);
 const matches=data.results.filter(city=>normalize(city.label)===key||normalize(`${city.name}, ${city.country}`)===key||normalize(city.name)===key);
 if(matches.length!==1)throw new Error('Choisissez votre destination dans la liste pour afficher les hôtels Agoda.');
 return matches[0].id;
}
