"""Routes configuration

The more specific and detailed routes should be defined first so they
may take precedent over the more generic routes. For more information
refer to the routes manual at http://routes.groovie.org/docs/
"""
from pylons import config
from routes import Mapper


def make_map():
    """Create, configure and return the routes Mapper"""
    map = Mapper(directory=config['pylons.paths']['controllers'],
                 always_scan=config['debug'])

    # The ErrorController route (handles 404/500 error pages); it should
    # likely stay at the top, ensuring it can always be resolved
    map.connect('error/:action/:id', controller='error')

    # CUSTOM ROUTES HERE
    import dirac.lib.credentials as credentials
    condDict = dict(function=credentials.checkURL)

    map.connect(':dsetup/:dgroup/:controller/:action/:id', conditions=condDict )
    map.connect(':dsetup/:controller/:action/:id',         dgroup='unknown', conditions=condDict )
    map.connect(':controller/:action/:id',                 dsetup='unknown', dgroup='unknown', conditions=condDict )
    map.connect(':dsetup/:dgroup/:controller/:action', id=None, conditions=condDict )
    map.connect(':dsetup/:controller/:action',         id=None, dgroup='unknown', conditions=condDict )
    map.connect(':controller/:action',                 id=None, dsetup='unknown', dgroup='unknown', conditions=condDict )
    map.connect(':dsetup/:dgroup/:controller', action='index', id=None, conditions=condDict )
    map.connect(':dsetup/:controller',         action='index', id=None, dgroup='unknown', conditions=condDict )
    map.connect(':controller',                 action='index', id=None, dsetup='unknown', dgroup='unknown', conditions=condDict )

    map.connect('*url', controller='template', action='view')

    return map
