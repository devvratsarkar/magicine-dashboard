import React, { Fragment, useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Link, useLocation, useParams } from "react-router-dom";
import { Imagesdata } from "../../commondata/commonimages";
import { MENUITEMS } from "../../commondata/sidemenu";
import { usePermissions } from "../../commondata/PermissionContext";

const Sidebar = () => {
  const { id } = useParams();
  const location = useLocation();
  const [mainmenu, setMainMenu] = useState(MENUITEMS);
  const { permissions, role } = usePermissions();

  // Utility function to match dynamic routes
  const isPathMatch = (pathname, pattern) => {
    if (!pathname || !pattern) return false;

    const pathSegments = pathname.split("/");
    const patternSegments = pattern.split("/");

    if (pathSegments.length !== patternSegments.length) {
      return false;
    }

    for (let i = 0; i < pathSegments.length; i++) {
      if (
        patternSegments[i] !== pathSegments[i] &&
        !patternSegments[i]?.startsWith(":")
      ) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    setNavActive(
      location.pathname.endsWith("/")
        ? location.pathname.slice(0, -1)
        : location.pathname
    );
  }, [location]);

  const setNavActive = (pathname) => {
    const updatedMenu = mainmenu.map((menu) => {
      const updatedItems = menu.Items.map((item) => {
        let isActive =
          isPathMatch(pathname, item.path) ||
          (item.related_fields &&
            item.related_fields.some((field) => isPathMatch(pathname, field)));

        if (item.children) {
          item.children.forEach((child) => {
            if (
              isPathMatch(pathname, child.path) ||
              (child.related_fields &&
                child.related_fields.some((field) => isPathMatch(pathname, field)))
            ) {
              isActive = true;
            }
          });
        }

        return {
          ...item,
          active: isActive,
          children: item.children
            ? item.children.map((child) => ({
              ...child,
              active:
                isPathMatch(pathname, child.path) ||
                (child.related_fields &&
                  child.related_fields.some((field) => isPathMatch(pathname, field))),
            }))
            : [],
        };
      });
      return {
        ...menu,
        Items: updatedItems,
      };
    });

    const updatedMenuWithParents = updatedMenu.map((menu) => {
      const updatedItems = menu.Items.map((item) => {
        if (item.type === "sub" && item.children) {
          const hasActiveChild = item.children.some((child) => child.active);
          return {
            ...item,
            active: hasActiveChild,
            children: item.children.map((child) => ({
              ...child,
              active:
                isPathMatch(pathname, child.path) ||
                (child.related_fields &&
                  child.related_fields.some((field) => isPathMatch(pathname, field))),
            })),
          };
        }
        return item;
      });
      return {
        ...menu,
        Items: updatedItems,
      };
    });

    setMainMenu(updatedMenuWithParents);
  };

  const toggletNavActive = (item) => {
    const updatedMenu = mainmenu.map((menu) => {
      const updatedItems = menu.Items.map((menuItem) => {
        if (menuItem === item) {
          return {
            ...menuItem,
            active: !menuItem.active,
          };
        }
        if (menuItem.type === "sub" && menuItem.children) {
          return {
            ...menuItem,
            active: menuItem.active && item.type === "link",
          };
        }
        return {
          ...menuItem,
          active: false,
        };
      });
      return {
        ...menu,
        Items: updatedItems,
      };
    });

    setMainMenu(updatedMenu);
  };

  const shouldShowMenuItem = (menuItem, role, permissions) => {
    if (role === "Admin") {
      return true;
    }

    if (menuItem.type === "sub" && menuItem.children) {
      return menuItem.children.some((child) => shouldShowMenuItem(child, role, permissions));
    }

    if (menuItem.permission && menuItem.model) {
      return permissions[menuItem.model]?.includes(menuItem.permission);
    }

    if (typeof menuItem.show === "function") {
      return menuItem.show(role, permissions);
    }

    return true;
  };

  return (
    <>
      <div className="sticky">
        <aside
          className="app-sidebar"
          onMouseOver={() => document.querySelector(".app")?.classList.add("sidenav-toggled-open")}
          onMouseOut={() => document.querySelector(".app")?.classList.remove("sidenav-toggled-open")}
        >
          <PerfectScrollbar options={{ suppressScrollX: true, useBothWheelAxes: false }}>
            <div className="header side-header">
              <Link
                to={`${import.meta.env.BASE_URL}dashboard/`}
                className="header-brand1"
              >
                <img
                  src={Imagesdata("logo3")}
                  className="header-brand-img desktop-logo"
                  alt={"logo"}
                />
                <img
                  src={Imagesdata("logo3")}
                  className="header-brand-img toggle-logo"
                  alt={"logo-1"}
                />
                <img
                  src={Imagesdata("logo3")}
                  className="header-brand-img light-logo"
                  alt={"logo-2"}
                />
                <img
                  src={Imagesdata("logo3")}
                  className="header-brand-img light-logo-testing"
                  alt={"logo-3"}
                />
              </Link>
            </div>

            <div className="main-sidemenu mt-3">
              <ul className="side-menu" id="sidebar-main">
                {mainmenu.map((levelone, i) => (
                  <Fragment key={i}>
                    {levelone.Items.map((menuItem, j) =>
                      shouldShowMenuItem(menuItem, role, permissions) ? (
                        <li
                          className={`slide ${menuItem.active && menuItem.type === "sub" ? "is-expanded" : ""}`}
                          key={j}
                        >
                          {menuItem.type === "link" ? (
                            <Link
                              to={menuItem.path}
                              className={`side-menu__item ${menuItem.active ? "active" : ""}`}
                              onClick={() => {
                                setNavActive(menuItem.path);
                                toggletNavActive(menuItem);
                              }}
                            >
                              <i className={`side-menu__icon fe fe-${menuItem.icon}`}></i>
                              <span className="side-menu__label">{menuItem.title}</span>
                            </Link>
                          ) : (
                            <Link
                              to="#"
                              className={`side-menu__item ${menuItem.active ? "active" : ""}`}
                              onClick={(e) => {
                                e.preventDefault();
                                toggletNavActive(menuItem);
                              }}
                            >
                              <i className={`side-menu__icon fe fe-${menuItem.icon}`}></i>
                              <span className="side-menu__label">{menuItem.title}</span>
                              <i
                                className={`angle fe ${menuItem.active ? "fe-chevron-down" : "fe-chevron-up"}`}
                              ></i>
                            </Link>
                          )}
                          {menuItem.type === "sub" && menuItem.children && (
                            <ul
                              className={`slide-menu ${menuItem.active ? "open" : ""}`}
                            >
                              {menuItem.children.map((child, k) =>
                                !child.show || child.show(role, permissions) ? (
                                  <li key={k}>
                                    <Link
                                      to={child.path}
                                      className={`slide-item ${child.active ? "active" : ""}`}
                                      onClick={() => {
                                        setNavActive(child.path);
                                        toggletNavActive(menuItem);
                                      }}
                                    >
                                      {child.title}
                                    </Link>
                                  </li>
                                ) : null
                              )}
                            </ul>
                          )}
                        </li>
                      ) : null
                    )}
                  </Fragment>
                ))}
              </ul>
            </div>
          </PerfectScrollbar>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;