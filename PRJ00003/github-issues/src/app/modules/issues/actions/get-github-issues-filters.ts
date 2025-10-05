

//https://api.github.com/repos/angular/angular/issues?state=open&labels=bug,documentation,dev,support

import { environment } from "src/environments/environment.development";

// TODO petticion http o feth para obtener los filtros (labels) disponibles en los issues
export const getGithubIssuesActionsByStateAndLables = async (state: string, labels: string[]) => {
  // Simulando una petición HTTP con un retraso
  await new Promise(resolve => setTimeout(resolve, 1000));

  //const url = `${environment.GITHUB_ANGULAR_PATH_BASE}/issues?state=${state}${labels.length > 0 ? `&labels=${labels.join(',')}` : ''}`;
  const params = new URLSearchParams();
  if(state && state !== 'all') params.append('state', state);
  if(labels.length > 0) params.append('labels', labels.join(','));

  const url = `${environment.GITHUB_ANGULAR_PATH_BASE}/issues?${params.toString()}`;

  try{

    const data = await fetch(url, {
      headers: {
        Authorization: `Bearer ${environment.GITHUB_TOKEN}`
      }
    }).then(res => {
      // if response htttp not ok
      if (!res.ok) {
        throw { status: res.status, message: res.statusText };
      }
      // if response ok
      return res.json();
    });

    return data;

  }catch (error: any) {
    console.error('Error original:', error);
    throw new Error(
      `Error al obtener los issues de GitHub: ${error?.message ?? ''}`,
      { cause: error }
    );
  }

}
