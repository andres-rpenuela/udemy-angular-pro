import { environment } from "src/environments/environment.development";
import { State } from "../interfaces/github-issue.interface";
import { getGithubIssuesActions } from "./get-github-issues.actions";

const BASE_URL = environment.GITHUB_ANGULAR_PATH_BASE;

const MOCK_ISSUE = [{
  id: 1,
  number: 123,
  title: "Issue title",
  body: "Issue body",
  state: State.Open,
  comments: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  labels: ['bug', 'enhancement']
}];

describe('GetGithubIssueCommentsAction', () => {
  let fetchSpy: jasmine.Spy;

  it('should create an action', async () => {

    const response = new Response(JSON.stringify(MOCK_ISSUE), {
      status: 200,
      headers: {
        'Content-type': 'application/json'
      }
    });

    spyOn(window, 'fetch').and.returnValue(Promise.resolve( response ));

    const action = await getGithubIssuesActions();

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/issues`,
      jasmine.objectContaining({
        headers: jasmine.objectContaining({
          Authorization: `Bearer ${environment.GITHUB_TOKEN}`
        })
      })
    );

    expect(action).toBeDefined();
    expect(Array.isArray(action)).toBeTrue();
    expect(action.length).toBe(1);
    expect(action[0].number).toBe(123);
    expect(action[0].state).toBe(State.Open);
  });

  it('should handle HTTP errors', async () => {

    const issueResponse = new Response(
      JSON.stringify(null),
      { status: 500, statusText: 'Internal Server Error' });

    spyOn(window, 'fetch').and.resolveTo(issueResponse);

    // Opción 2: Verificar que se rechaza con un mensaje específico
    await expectAsync(getGithubIssuesActions())
      .toBeRejected();
      //.toBeRejectedWithError('Internal Server Error'); // Sidevolvier un error personalizado

    // Opción 3: Usar try/catch para verificar el error
    try {
      await getGithubIssuesActions();
      fail('Should have thrown an error');
    }
    catch (error) {
      expect(error).toBeDefined();
      expect((error as any).message).toContain('Internal Server Error');
    }
    // Verificar que fetch fue llamado
    expect(fetch).toHaveBeenCalled();
  });

});
