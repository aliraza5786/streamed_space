// src/features/sheets/api.ts
import { computed, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useApiMutation } from '../libs/vq'
import { request } from '../libs/api'

/** -----------------------------
 * Stable query keys
 * ----------------------------- */
export const keys = {
  sheets: (wmId?: string | number, wId?: string | number) =>
    ['sheets', wmId, wId] as const,
  sheetList: (
    moduleId?: string | number,
    sheetId?: string | number,
    laneIds?: string | number | (string | number)[] | null | undefined,
    viewBy?: string | number
  ) => ['sheet-list', moduleId, sheetId, laneIds, viewBy] as const,
}

/** -----------------------------
 * Mutations
 * ----------------------------- */

// POST /sheets  (create workspace sheet)
export const useCreateWorkspaceSheet = (options = {}) =>
  useApiMutation<{ data: unknown }, any>(
    {
      key: ['product-sheet'],
      url: '/sheets/add',
      method: 'POST',
    },
    options as any
  )

// PATCH /workspace/sheet-list/update
export const useMoveList = (options = {}) =>
  useApiMutation<{ data: unknown }, { payload: any }>(
    {
      key: ['move-list'],
      url: '/workspace/sheet-list/update',
      method: 'PATCH',
    },
    options as any
  )

// PATCH /workspace/cards/update
export const useMoveCard = (options = {}) =>
  useApiMutation<{ data: unknown }, { payload: any }>(
    {
      key: ['move-card'],
      url: '/workspace/cards/update',
      method: 'PATCH',
    },
    options as any
  )

// POST /workspace/catalog/variable/value
export const useAddList = (options = {}) =>
  useApiMutation<{ data: unknown }, any>(
    {
      key: ['add-list'],
      url: '/workspace/catalog/variable/value',
      method: 'POST',
    },
    options as any
  )

/** -----------------------------
 * Queries
 * ----------------------------- */

/**
 * GET /sheets?workspace_module_id=...&workspace_id=...
 * `queryParams` may contain refs/computeds; we unref at fetch time.
 */
export const useSheets = (
  queryParams: {
    workspace_module_id: any
    workspace_id?: any
  },
  options = {}
) => {
  const wmId = computed(() => unref(queryParams.workspace_module_id))
  const wId = computed(() => unref(queryParams.workspace_id))

  return useQuery({
    queryKey: keys.sheets(wmId.value, wId.value),
    enabled: computed(() => !!wmId.value),
    queryFn: ({ signal }) =>
      request<any>({
        url: '/sheets',
        method: 'GET',
        params: {
          workspace_module_id: wmId.value,
          workspace_id: wId.value,
        },
        signal,
      }).then((d) => d),
    ...options,
  })
}

/**
 * GET /workspace/cards/grouped?module_id=&sheet_id=&variable_id=&lane_ids=
 * NOTE: Your original code had the param order wrong when calling fetch; fixed here.
 */
export const useSheetList = (
  module_id: any,
  sheet_id: any,
  laneIds: any,
  view_by: any,
  options = {}
) => {
  const modId = computed(() => unref(module_id))
  const shId = computed(() => unref(sheet_id))
  const viewBy = computed(() => unref(view_by))

  // normalize laneIds -> string like "1,2,3" (deduped)
  const laneIdsParam = computed<string | undefined>(() => {
    const v = unref(laneIds)
    if (v == null) return undefined
    if (Array.isArray(v)) {
      const joined = Array.from(
        new Set(v.map((x) => String(x).trim()).filter(Boolean))
      ).join(',')
      return joined || undefined
    }
    const single = String(v).trim()
    return single || undefined
  })

  const key = computed(() =>
    keys.sheetList(modId.value, shId.value, laneIdsParam.value, viewBy.value)
  )

  return useQuery({
    queryKey: key,
    enabled: computed(() => !!modId.value && !!shId.value && !!viewBy.value),
    queryFn: ({ signal }) =>
      request<any>({
        url: '/workspace/cards/grouped',
        method: 'GET',
        params: {
          module_id: modId.value,
          sheet_id: shId.value,
          variable_id: viewBy.value,
          ...(laneIdsParam.value ? { lane_ids: laneIdsParam.value } : {}),
        },
        signal,
      }),
    ...options,
  })
}
