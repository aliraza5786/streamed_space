// src/features/workspaces/queries.ts
import { useApiQuery, useApiMutation } from "../libs/vq.ts";
import { request } from "../libs/api.ts"; // for dynamic-URL mutations

/** ---------------------------------
 * Query Keys (stable & parameterized)
 * -------------------------------- */
export const keys = {
  description: (id: string | number) => ["description", id] as const,
  suggestions: (category: string) => ["suggestions", category] as const,
  industries: ["industries"] as const,
  userTypes: ["user-types"] as const,
  technologies: ["technologies"] as const,
  platforms: ["platforms"] as const,
  workspacesPrompt: ["workspaces", "prompt"] as const,

  workspaces: ["workspaces"] as const,
  workspacesTitles: ["workspaces", "titles"] as const,
  singleWorkspace: (id: string | number) => ["workspaces", "byId", id] as const,
  workspaceModules: ["workspaces", "modules"] as const,
  workspaceRoles: (id: string | number) => ["workspaces", "roles", id] as const,
  workspaceVariables: ["workspaces", "variables"] as const,

  invitedWorkspace: (id: string | number) =>
    ["invited", "workspace", id] as const,
  checkProgress: (id: string | number) =>
    ["workspace", "progress", id] as const,

  // mutations
  invitePeople: ["invitations", "send"] as const,
  createWorkspaceAI: ["workspace", "create-ai"] as const,
  createWorkspace: ["workspace", "create"] as const,
  createLanes: ["workspace", "create-lanes-ai"] as const,
  updateInvited: ["invited", "update"] as const,
  deleteInvited: ["invited", "delete"] as const,
};

/** -----------------
 * Queries (GET)
 * ----------------- */
export const useDescription = () =>
  useApiQuery({
    key: keys.description("suggestion"),
    url: `/common/session-data/`,
    method: "GET",
  });

export const useSuggestions = (category: string) =>
  useApiQuery({
    key: keys.suggestions(category),
    url: "/common/workspace-descriptions-filter",
    method: "GET",
    params: { description_category: category },
    enabled: !!category,
  });

export const useIndustries = () =>
  useApiQuery({
    key: keys.industries,
    url: "/common/industries",
    method: "GET",
  });

export const useUserType = () =>
  useApiQuery({
    key: keys.userTypes,
    url: "/common/industry-users",
    method: "GET",
  });

export const useTechnologies = () =>
  useApiQuery({
    key: keys.technologies,
    url: "/common/technologies",
    method: "GET",
  });

// NOTE: endpoint spelling kept as in your API: /common/plateforms
export const usePlatforms = () =>
  useApiQuery({
    key: keys.platforms,
    url: "/common/plateforms",
    method: "GET",
  });

export const useWorkspacesPrompt = () =>
  useApiQuery({
    key: keys.workspacesPrompt,
    url: "/common/prompts-byname/workspace",
    method: "GET",
  });

export const useWorkspaces = () =>
  useApiQuery({
    key: keys.workspaces,
    url: "/workspace/all",
    method: "GET",
  });

export const useWorkspacesTitles = () =>
  useApiQuery({
    key: keys.workspacesTitles,
    url: "/workspace/titles",
    method: "GET",
  });

export const useSingleWorkspace = (id: string | number) =>
  useApiQuery({
    key: keys.singleWorkspace(id),
    url: `/workspace/${id}`,
    method: "GET",
    params: { is_archive: false },
    enabled: !!id,
  });

export const useWorkspacesModules = () =>
  useApiQuery({
    key: keys.workspaceModules,
    url: "/common/workspace-modules",
    method: "GET",
  });

export const useWorkspacesRoles = (id: string | number) =>
  useApiQuery({
    key: keys.workspaceRoles(id),
    url: `/workspace/teams/${id}`,
    method: "GET",
    enabled: !!id,
  });

export const useWorkspacesVariables = () =>
  useApiQuery({
    key: keys.workspaceVariables,
    url: "/common/prompt-variables-filterable",
    method: "GET",
  });

export const useInvitedWorkspace = (id: string | number) =>
  useApiQuery({
    key: keys.invitedWorkspace(id),
    url: `/common/team/${id}`,
    method: "GET",
    enabled: !!id,
  });

export const useCheckProgress = (
  id: string | number,
  options?: Parameters<typeof useApiQuery>[1]
) =>
  useApiQuery(
    {
      key: keys.checkProgress(id),
      url: `/workspace/step2/tasks/${id}`,
      method: "GET",
      enabled: !!id,
    },
    options
  );

/** -----------------
 * Mutations (POST/PUT/DELETE)
 * ----------------- */

// payload: { ... }
export const useCreateWorkspaceWithAI = (options = {}) =>
  useApiMutation<{ data: unknown }, any>(
    {
      key: keys.createWorkspaceAI,
      url: "/workspace/step-1-ai",
      method: "POST",
    },
    options as any
  );

export const useCreateWorkspace = (options = {}) =>
  useApiMutation<{ data: unknown }, any>(
    {
      key: keys.createWorkspace,
      url: "/workspace",
      method: "POST",
    },
    options as any
  );

export const useCreateLanes = (options = {}) =>
  useApiMutation<{ data: unknown }, any>(
    {
      key: keys.createLanes,
      url: "/workspace/step-2-ai",
      method: "POST",
    },
    options as any
  );

// payload: { workspaceId, emails: string[] }
export const useInvitePeople = (options = {}) =>
  useApiMutation<{ data: unknown }, any>(
    {
      key: keys.invitePeople,
      url: "/workspace/invitation/send",
      method: "POST",
    },
    options as any
  );

type UpdateInvitedVars = { id: string | number; payload: any };
export const useUpdateInvitedWorkspace = (options = {}) =>
  // PUT /common/team/:id  with body = payload
  // (using request directly because url depends on variables)
  useApiMutation<any, UpdateInvitedVars>(
    {
      key: keys.updateInvited,
    } as any,
    {
      mutationFn: (vars: UpdateInvitedVars) =>
        request({
          url: `/common/team/${vars.id}`,
          method: "PUT",
          data: vars.payload,
        }),
      ...(options as any),
    } as any
  );

type DeleteInvitedVars = { id: string | number };
export const useDeleteInvitedPeople = (options = {}) =>
  useApiMutation<any, DeleteInvitedVars>(
    { key: keys.deleteInvited } as any,
    {
      mutationFn: (vars: DeleteInvitedVars) =>
        request({
          url: `/common/team/${vars.id}`,
          method: "DELETE",
        }),
      ...(options as any),
    } as any
  );
