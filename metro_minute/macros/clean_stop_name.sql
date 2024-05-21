{# 
    This macro replaces specific substrings in ar_rname:
    - "Gare de" or "Gare d'" with an empty string
    - "Gare des" with "Les"
    - "Gare du" with "Le"
    It does not modify specific station names: "Gare du Nord", "Gare de Lyon", "Gare de l'Est"
#}

{% macro clean_stop_name(ar_rname) -%}

    case 
        when {{ ar_rname }} in ('Gare du Nord', 'Gare de Lyon', 'Gare de l''Est') then {{ ar_rname }}
        else replace(
            replace(
                replace(
                    replace(
                        {{ ar_rname }},
                        'Gare d''',
                        ''
                    ),
                    'Gare des',
                    'Les'
                ),
                'Gare de',
                ''
            ),
            'Gare du',
            'Le'
        )
    end

{%- endmacro %}
