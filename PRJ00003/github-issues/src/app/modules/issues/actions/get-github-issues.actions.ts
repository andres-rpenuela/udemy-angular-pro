import { sleep } from "@app/helpers/sleep.helper";
import { firstValueFrom } from "rxjs";
import { environment } from "src/environments/environment.development"
import { GitHubIssue, State } from "../interfaces/github-issue.interface";

//https://api.github.com/repos/angular/angular/issues
export const getGithubIssuesActions = async  () : Promise<GitHubIssue[]> =>  {
  // debug para simular error y ver modal
  //throw new Error("error inesperado");// o lanzar un mensaje personalizado

  await sleep(1500); // dealy de 1,5 s

  const url = `${environment.GITHUB_ANGULAR_PATH_BASE}/issues`;

  try{

    const data = await
      fetch(url, {
        headers: {
          Authorization: `Bearer ${environment.GITHUB_TOKEN}`
        }
      }).then(res => {
        if (!res.ok) {
          throw { status: res.status, message: res.statusText };
        }
        return res.json();
      });

    console.log('✅ Issues cargados:', data);
    return data;

  }catch(error: any){
    if (error.status === 404) {
      console.warn('❌ Endpoint no encontrado');
    } else {
      console.error('❌ Error HTTP:', error.status, error.message);
    }
    throw error; // o lanzar un mensaje personalizado
  }
}

//https://api.github.com/repos/angular/angular/issues?state=open
export const getGithubIssuesActionsByState = async ( state: State = State.All) : Promise<GitHubIssue[]> =>  {
  await sleep(1500); // dealy de 1,5 s

  //const url = `${environment.GITHUB_ANGULAR_PATH_BASE}/issues?state=${state}`;

  const params = new URLSearchParams();
  params.set('state', state);
  const url = `${environment.GITHUB_ANGULAR_PATH_BASE}/issues?${params.toString()}`;

  try{

    const data = await
      fetch(url, {
        headers: {
          Authorization: `Bearer ${environment.GITHUB_TOKEN}`
        }
      }).then(res => {
        if (!res.ok) {
          throw { status: res.status, message: res.statusText };
        }
        return res.json();
      });

    console.log('✅ Issues cargados:', data);
    return data;

  }catch(error: any){
    if (error.status === 404) {
      console.warn('❌ Endpoint no encontrado');
    } else {
      console.error('❌ Error HTTP:', error.status, error.message);
    }
    throw error; // o lanzar un mensaje personalizado
  }
}
