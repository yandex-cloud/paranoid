Библиотека для отображения топологии кластеров

### Превью и дев-режим

```
npm ci
npm start
```

### TODO

- [ ] Доработки по дизайну (точечный фон, кривые линии etc)
- [x] Кастомные цвета (для тем из dark/light theme)
- [x] Группировка нод
- [x] Несколько рутов у графа
- [ ] Оптимизация
- [ ] Схлопывание нод при зуме
- [ ] Минимапа
- [ ] Хуки при клике на ноду
- [x] Иконка "скопировать в буфер" при наведении на имя ноды
- [ ] Несколько родителей у ноды



### API

* `renderGraph(domNodeId: string, data: Data, opts?: Options)`, domNodeId - айди дом элемента, куда прицепится граф; data, opts - [данные и опции для рендера графа](#models)


### Models

```typescript
// Нода графа
export interface GraphNode {
    name: string;
    status?: string;
    meta?: string;
    group?: string;
}

// Связь между графами
export interface Link {
    from: string;
    to: string;
}

export enum LinkType {
    Arrow = 'arrow',
    Line = 'line',
}

// Данные, необходимые для рендера базового графика
export interface Data {
    links: Link[];
    nodes: GraphNode[];
}

export enum TextOverflow {
    Normal = 'normal', // Ширина узла будет подстраиваться под текст
    Ellipsis = 'ellipsis', // Невлезающий текст будет будет скрыт за '...'
}

export interface Options {
    colors?: Colors;
    linkType?: LinkType; // default Arrow
    renderNodeTitle?: (node: GraphNode) => string;
    onTitleClick?: (node: GraphNode) => void;
    prepareCopyText?: (node: GraphNode) => string; // возвращает строку, которая будет скопирована в буфер
    textOverflow?: TextOverflow; // default Ellipsis
}

/*
    'success': '#07a300',
    'error': '#ff0400',
    'warning': '#ff7700',
    'mute': 'rgba(0,0,0,0.15)',
    'stroke': 'rgba(0,0,0,0.3)',
    'fill': '#fafafa',
    'nodeFill': '#ffffff',
    'nodeShadow': 'rgba(0,0,0,0.15)',
    'titleColor': '#000000',
    'textColor': 'rgba(0,0,0,0.7)',
    'buttonBorderColor': 'rgba(0,0,0,0.07)',
    'groupBorderColor': '#dcedfd',
    'groupFill': '#ebf4fe',
    'titleHoverColor:' '#004080',
*/
export interface Colors {
    success?: string;
    error?: string;
    warning?: string;
    mute?: string;
    stroke?: string;
    fill?: string;
    nodeFill?: string;
    nodeShadow?: string;
    titleColor?: string;
    textColor?: string;
    buttonBorderColor?: string;
    groupBorderColor?: string;
    groupFill?: string;
    titleHoverColor?: string;
}
```
