import { environment } from "src/environments/environment.development";
import { State } from "../interfaces/github-issue.interface";
import { getGithubIssuesActionsByStateAndLables } from "./get-github-issues-filters";

const ISSUE_NUMBER = 123;
const BASE_URL = environment.GITHUB_ANGULAR_PATH_BASE;

const MOCK_ISSUE = {
  id: 1,
  number: ISSUE_NUMBER,
  title: "Issue title",
  body: "Issue body",
  state: State.Open,
  comments: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  labels: ['bug', 'enhancement']
}


describe('getGithubIssuesActionsByStateAndLabels', () => {
  let fetchSpy: jasmine.Spy;

  // Mock con Jasmine/Karma
  // beforeEach(() => {
  //   // windows porque estamos en testin
  //   fetchSpy = spyOn(window, 'fetch');
  // });


  it('should return the correct action type', async () => {
    const state = State.Open;
    const labels = ['bug', 'enhancement'];

    const issueResponse = new Response(
      JSON.stringify([MOCK_ISSUE]),
      { status: 200, statusText: 'OK' });

    spyOn(window, 'fetch').and.resolveTo(issueResponse);

    const action = await getGithubIssuesActionsByStateAndLables(state, labels);

    // Verificar que fetch fue llamado con la URL correcta
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/issues?state=${state}&labels=${labels.join('%2C')}`, // %2C === ','
      jasmine.objectContaining({
        headers: jasmine.objectContaining({
          Authorization: `Bearer ${environment.GITHUB_TOKEN}`
        })
      })
    );

    expect(action).toBeDefined(); // Asegurarse de que action no es undefined
    expect(Array.isArray(action)).toBeTrue(); // Asegurarse de que action es un array
    expect(action.length).toBe(1); // Asegurarse de que action tiene un elemento
    expect(action[0].number).toBe(ISSUE_NUMBER); // Asegurarse de que el número del issue es correcto
    expect(action[0].state).toBe(State.Open); // Asegurarse de que el estado del issue es correcto

  });

   it('should throw error the action type', async () => {
    const state = State.Open;
    const labels = ['bug', 'enhancement'];

    const issueResponse = new Response(
      JSON.stringify(null),
      { status: 500, statusText: 'Internal Server Error' });

    spyOn(window, 'fetch').and.resolveTo(issueResponse);


    // Opción 1: Verificar que se rechaza la promesa
    await expectAsync(getGithubIssuesActionsByStateAndLables(state, labels))
      .toBeRejected();

    // Opción 2: Verificar que se rechaza con un mensaje específico
    await expectAsync(getGithubIssuesActionsByStateAndLables(state, labels))
      .toBeRejectedWithError('Error al obtener los issues de GitHub: Internal Server Error');

    // Opción 3: Usar try/catch para verificar el error
    try {
      await getGithubIssuesActionsByStateAndLables(state, labels);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
      expect((error as any).message).toContain('Internal Server Error');
    }

    // Verificar que fetch fue llamado
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/issues?state=${state}&labels=${labels.join('%2C')}`,
      jasmine.objectContaining({
        headers: jasmine.objectContaining({
          Authorization: `Bearer ${environment.GITHUB_TOKEN}`
        })
      })
    );
  });
});
