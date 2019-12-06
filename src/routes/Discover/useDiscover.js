const React = require('react');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const initDiscoverState = () => ({
    selectable: {
        types: [],
        catalogs: [],
        extra: [],
        has_next_page: false,
        has_prev_page: false
    },
    catalog_resource: null
});

const mapDiscoverState = (discover) => {
    const selectable = discover.selectable;
    const catalog_resource = discover.catalog_resource !== null && discover.catalog_resource.content.type === 'Ready' ?
        {
            ...discover.catalog_resource,
            content: {
                ...discover.catalog_resource.content,
                content: discover.catalog_resource.content.content.map((metaItem) => {
                    metaItem.released = new Date(metaItem.released);
                    metaItem.href = `#/metadetails/${encodeURIComponent(metaItem.type)}/${encodeURIComponent(metaItem.id)}`;
                    return metaItem;
                })
            }
        }
        :
        discover.catalog_resource;
    return { selectable, catalog_resource };
};

const onNewDiscoverState = (discover) => {
    if (discover.catalog_resource === null && discover.selectable.types.length > 0) {
        return {
            action: 'Load',
            args: {
                load: 'CatalogFiltered',
                args: discover.selectable.types[0].load_request
            }
        };
    }
};

const useDiscover = (urlParams, queryParams) => {
    const { core } = useServices();
    const loadDiscoverAction = React.useMemo(() => {
        if (typeof urlParams.addonTransportUrl === 'string' && typeof urlParams.type === 'string' && typeof urlParams.catalogId === 'string') {
            return {
                action: 'Load',
                args: {
                    load: 'CatalogFiltered',
                    args: {
                        base: urlParams.addonTransportUrl,
                        path: {
                            resource: 'catalog',
                            type_name: urlParams.type,
                            id: urlParams.catalogId,
                            extra: Array.from(queryParams.entries())
                        }
                    }
                }
            };
        } else {
            const discover = core.getState('discover');
            if (discover.selectable.types.length > 0) {
                return {
                    action: 'Load',
                    args: {
                        load: 'CatalogFiltered',
                        args: discover.selectable.types[0].load_request
                    }
                };
            }
        }
    }, [urlParams, queryParams]);
    return useModelState({
        model: 'discover',
        action: loadDiscoverAction,
        map: mapDiscoverState,
        init: initDiscoverState,
        onNewState: onNewDiscoverState
    });
};

module.exports = useDiscover;
