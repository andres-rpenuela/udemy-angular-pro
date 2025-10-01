import { sleep } from "@app/helpers/sleep.helper";
import { environment } from "src/environments/environment.development"


//https://api.github.com/repos/angular/angular/labels
export const getGithubLabelsActions = async () => {
   await sleep(1500); // dealy de 1,5 s

   const url = `${environment.GITHUB_ANGULAR_PATH_BASE}/labels`;

   try{
    const data = await
      fetch(url, {
        headers: {
          'Authorization': `Bearer ${environment.GITHUB_TOKEN}`
        }
      });

      if (!data.ok) {
        throw new Error(data.statusText || 'Respuesta no OK de GitHub');
      }
      return await data.json();

   } catch (error: any) {
     console.error('Error original:', error);
     throw new Error(
       `Error al obtener las etiquetas de GitHub: ${error?.message ?? ''}`,
       { cause: error }
     );
   }
};
