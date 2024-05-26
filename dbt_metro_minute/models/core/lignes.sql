SELECT
    ID_Line as line_id,
    'STIF:Line::' || ID_line || ':' as line_ref,
    Name_Line as line_name, 
    ShortName_Line as line_shortname, 
    TransportMode as transport_mode, 
    TransportSubmode as transport_submode, 
    OperatorRef as operator_ref, 
    OperatorName as operator_name
FROM {{ source('referentiel_raw', 'lignes') }}