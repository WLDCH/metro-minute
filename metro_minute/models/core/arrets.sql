SELECT 
    ArRId as ar_rid,
    'STIF:StopPoint:Q:' || ArRId || ':' as ar_rref,
    ArRVersion as ar_rversion,
    -- ArRName as ar_rname,
    {{ clean_stop_name('ArRName') }} as ar_rname,
    ArRType as ar_rtype,
    ArRTown as ar_rtown,
    ArRAccessibility as ar_raccessibilty
FROM {{ source('referentiel_raw', 'arrets') }}