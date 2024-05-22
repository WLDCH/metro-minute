SELECT
    tr.MonitoringRef_ArR as ar_rref,
    {{ clean_stop_name('tr.arrname') }} as ar_rname,
    a.ar_rtown,
    tr.lineref as line_ref,
    tr.name_line,
    l.transport_mode,
    l.transport_submode
FROM {{ source('referentiel_raw', 'donnees_temps_reel') }} tr
INNER JOIN {{ ref('lignes') }} l ON tr.lineref = l.line_ref
INNER JOIN {{ ref('arrets') }} a on tr.MonitoringRef_ArR = a.ar_rref
WHERE l.transport_mode = 'rail'  AND tr.name_line IN ('A', 'B', 'C', 'D', 'E')