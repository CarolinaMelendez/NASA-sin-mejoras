<template>
<div
    class="l-shell"
    :class="{
        'is-editing': isEditing
    }"
>
    <div
        class="l-shell__head"
        :class="{
            'l-shell__head--expanded': headExpanded,
            'l-shell__head--minify-indicators': !headExpanded
        }"
    >
        <CreateButton class="l-shell__create-button" />
        <indicators class="l-shell__head-section l-shell__indicators" />
        <button
            class="l-shell__head__collapse-button c-button"
            @click="toggleShellHead"
        ></button>
        <notification-banner />
        <div class="l-shell__head-section l-shell__controls">
            <button
                class="c-icon-button c-icon-button--major icon-new-window"
                title="Open in a new browser tab"
                target="_blank"
                @click="openInNewTab"
            ></button>
            <button
                :class="['c-icon-button c-icon-button--major', fullScreen ? 'icon-fullscreen-collapse' : 'icon-fullscreen-expand']"
                :title="`${fullScreen ? 'Exit' : 'Enable'} full screen mode`"
                @click="fullScreenToggle"
            ></button>
        </div>
        <app-logo />
    </div>
    <multipane
        class="l-shell__main"
        type="horizontal"
    >
        <pane
            class="l-shell__pane-tree"
            handle="after"
            label="Browse"
            collapsable
        >
            <mct-tree class="l-shell__tree" />
        </pane>
        <pane class="l-shell__pane-main">
            <browse-bar
                ref="browseBar"
                class="l-shell__main-view-browse-bar"
            />
            <toolbar
                v-if="toolbar"
                class="l-shell__toolbar"
            />
            <object-view
                ref="browseObject"
                class="l-shell__main-container"
                :show-edit-view="true"
                data-selectable
            />
            <component
                :is="conductorComponent"
                class="l-shell__time-conductor"
            />
        </pane>
        <pane
            class="l-shell__pane-inspector l-pane--holds-multipane"
            handle="before"
            label="Inspect"
            collapsable
        >
            <Inspector
                ref="inspector"
                :is-editing="isEditing"
            />
        </pane>
    </multipane>
</div>
</template>

<script>
import Inspector from '../inspector/Inspector.vue';
import MctTree from './mct-tree.vue';
import ObjectView from '../components/ObjectView.vue';
import MctTemplate from '../legacy/mct-template.vue';
import CreateButton from './CreateButton.vue';
import multipane from './multipane.vue';
import pane from './pane.vue';
import BrowseBar from './BrowseBar.vue';
import Toolbar from '../toolbar/Toolbar.vue';
import AppLogo from './AppLogo.vue';
import Indicators from './status-bar/Indicators.vue';
import NotificationBanner from './status-bar/NotificationBanner.vue';

var enterFullScreen = () => {
    var docElm = document.documentElement;

    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) { /* Firefox */
        docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        docElm.webkitRequestFullscreen();
    } else if (docElm.msRequestFullscreen) { /* IE/Edge */
        docElm.msRequestFullscreen();
    }
};
var exitFullScreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
    else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

export default {
    inject: ['openmct'],
    components: {
        Inspector,
        MctTree,
        ObjectView,
        'mct-template': MctTemplate,
        CreateButton,
        multipane,
        pane,
        BrowseBar,
        Toolbar,
        AppLogo,
        Indicators,
        NotificationBanner
    },
    data: function () {
        let storedHeadProps = window.localStorage.getItem('openmct-shell-head');
        let headExpanded = true;
        if (storedHeadProps) {
            headExpanded = JSON.parse(storedHeadProps).expanded;
        }

        return {
            fullScreen: false,
            conductorComponent: undefined,
            isEditing: false,
            hasToolbar: false,
            headExpanded
        }
    },
    computed: {
        toolbar() {
            return this.hasToolbar && this.isEditing;
        }
    },
    mounted() {
        this.openmct.editor.on('isEditing', (isEditing)=>{
            this.isEditing = isEditing;
        });

        this.openmct.selection.on('change', this.toggleHasToolbar);
    },
    methods: {
        toggleShellHead() {
            this.headExpanded = !this.headExpanded;

            window.localStorage.setItem(
                'openmct-shell-head',
                JSON.stringify(
                    {
                        expanded: this.headExpanded
                    }
                )
            );
        },
        fullScreenToggle() {
            if (this.fullScreen) {
                this.fullScreen = false;
                exitFullScreen();
            } else {
                this.fullScreen = true;
                enterFullScreen();
            }
        },
        openInNewTab(event) {
            window.open(window.location.href);
        },
        toggleHasToolbar(selection) {
            let structure = undefined;

            if (!selection || !selection[0]) {
                structure = [];
            } else {
                structure = this.openmct.toolbars.get(selection);
            }

            this.hasToolbar = structure.length > 0;
        }
    }
}
</script>