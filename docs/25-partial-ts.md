# Partial<T>

En TypeScript, `Partial<T>` es un **utility type** muy útil.

---

## 1️⃣ Concepto

`Partial<T>` transforma **todas las propiedades de un tipo `T` en opcionales**.

Ejemplo:

```ts
interface GitHubIssue {
  id: number;
  title: string;
  body: string;
  labels: string[];
}
```

Si hacemos:

```ts
const issue: Partial<GitHubIssue> = {
  title: 'Nuevo issue'
};
```

✅ Esto es válido porque `Partial` permite que **faltan todas las demás propiedades** (`id`, `body`, `labels`).

Sin `Partial` tendrías que escribir:

```ts
const issue: GitHubIssue = {
  id: 0,
  title: 'Nuevo issue',
  body: '',
  labels: []
}; // obligatorio incluir todas las propiedades
```

---

## 2️⃣ Uso típico

* Cuando quieres **crear o actualizar un objeto parcialmente**.
* Muy usado en **mutaciones** (`POST`, `PATCH`) donde no todos los campos son obligatorios.

```ts
createIssue(issue: Partial<GitHubIssue>) {
  return this.http.post<GitHubIssue>('url', issue);
}
```

Así, puedes enviar solo los campos que quieres crear o modificar.

---

## 3️⃣ Visualización

```ts
type GitHubIssueOptional = Partial<GitHubIssue>;

// Equivalente a:
type GitHubIssueOptional = {
  id?: number;
  title?: string;
  body?: string;
  labels?: string[];
}
```

---

En resumen:

* `Partial<T>` = “haz opcionales todas las propiedades de T”.
* Muy útil para crear objetos incompletos o para enviar solo algunos campos a un backend.
