SELECT
    tr.MonitoringRef_ArR as ar_rref,
    LTRIM({{ clean_stop_name('tr.arrname') }}, ' ') as ar_rname,
    a.ar_rtown,
    tr.lineref as line_ref,
    tr.name_line,
    l.transport_mode,
    l.transport_submode
FROM {{ source('referentiel_raw', 'donnees_temps_reel') }} tr
INNER JOIN {{ ref('lignes') }} l ON tr.lineref = l.line_ref
INNER JOIN {{ ref('arrets') }} a on tr.MonitoringRef_ArR = a.ar_rref
WHERE l.transport_mode = 'tram'
AND tr.monitoringRef_ArR NOT IN ('STIF:StopPoint:Q:471757:', 'STIF:StopPoint:Q:472172:', 'TIF:StopPoint:Q:411410:', 'STIF:StopPoint:Q:471878:', 'STIF:StopPoint:Q:472503:', 'STIF:StopPoint:Q:470874:', 'STIF:StopPoint:Q:472969:', 'STIF:StopPoint:Q:411415:', 'STIF:StopPoint:Q:472920:', 'STIF:StopPoint:Q:472986:', 'STIF:StopPoint:Q:471675:', 'STIF:StopPoint:Q:471933: ', 'STIF:StopPoint:Q:471887:', 'STIF:StopPoint:Q:472968:', 'STIF:StopPoint:Q:470851:', 'STIF:StopPoint:Q:472820:', 'STIF:StopPoint:Q:411416:', 'STIF:StopPoint:Q:471933:')
